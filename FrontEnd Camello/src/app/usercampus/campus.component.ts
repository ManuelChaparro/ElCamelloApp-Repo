import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';

interface Campus{
  name: string;
  description: string;
  quantity_spaces: number;
  address: string;
  id_sede: number;
  schedules: {
    day: string;
    first_open: string;
    first_close: string;
    second_open: string;
    second_close: string;
  }[];
}

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent {

  public campus_list: Array<Campus>;
  public campus_id_list: Array<Iterable<any>> | undefined;

  ngOnInit(){
    this.loadCampusOnDatabase();
  }

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.campus_list = [];
    this.campus_id_list = [];
  }

  loadCampusOnDatabase(){
    const url = this.routesList.getCampusList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0]){
        const rol = infoUser[0].rol;
        this.http.get(url, {headers}).subscribe(response => {
          const campus = response as Array<string>;
          campus.forEach(n => {
              const info_campus = n as Object;
              if('nombre_sede' in info_campus && 'descripcion' in info_campus && 'direccion' in info_campus
              && 'id_sede' in info_campus){
                const url = this.routesList.getQuantitySpacesPerCampus();
                const data = {
                  headquarter_id: info_campus.id_sede,
                  rol: rol
                }
                this.http.post(url, data, {headers}).subscribe(res => {
                  const xd = res as Array<string>;
                  xd.forEach(j => {
                    const xdd = j as Object;
                    if('quantity' in xdd){
                      const newCampus: Campus = {
                        name: info_campus.nombre_sede as string,
                        description: info_campus.descripcion as string,
                        quantity_spaces: xdd.quantity as number,
                        address: info_campus.direccion as string,
                        id_sede: info_campus.id_sede as number,
                        schedules: []
                      }
                      this.loadIdCampus(newCampus as Campus);
                    }
                  });
                });
              }
          });
        });
      }
    }
  }

  loadIdCampus(newCampus: Campus){
    const url = this.routesList.getScheduleCampus();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const data = {
      id_headquarter: newCampus.id_sede
    };
    this.http.post(url, data, { headers }).subscribe((data) => {
      const campus_schedule = data as Array<any>;
      campus_schedule.forEach(n => {
        const hora_apertura_am = n.hora_apertura_am as string;
        const hora_cierre_am = n.hora_cierre_am as string;
        const hora_apertura_pm = n.hora_apertura_pm as string;
        const hora_cierre_pm = n.hora_cierre_pm as string;
        const newschedule = {
          day: n.dia,
          first_open: hora_apertura_am.slice(0, -3),
          first_close: hora_cierre_am.slice(0, -3),
          second_open: hora_apertura_pm.slice(0, -3),
          second_close: hora_cierre_pm.slice(0, -3),
        };
        newCampus.schedules.push(newschedule);
      });
      this.sortDays(newCampus);
    });
  }

  sortDays(newCampus: Campus){
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    newCampus.schedules.sort((a,b) => days.indexOf(a.day) - days.indexOf(b.day));
    this.campus_list.push(newCampus as Campus);
  }

  public showModal(): void{
    const modal = document.querySelector('#infoModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

}
