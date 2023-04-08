import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcampusComponent } from './newcampus.component';

describe('NewcampusComponent', () => {
  let component: NewcampusComponent;
  let fixture: ComponentFixture<NewcampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewcampusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewcampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
