'use strict'

const jwt = require('jsonwebtoken');
const connection = require('../../config/connections.js');

const makeBooking = async(req, res) =>{
    jwt.verify(req.token, 'secretkey', async(error)=>{
        const {space_id, client_id, date_booking, hour_start, hour_end, note} = req.body
        if(!error){
            await connection.query(`select id_reserva from reservas where id_espacio = ${connection.escape(space_id)} and fecha = ${connection.escape(date_booking)} and hora_entrada between ${connection.escape(hour_start)} and ${connection.escape(hour_end)} and hora_salida between ${connection.escape(hour_start)} and ${connection.escape(hour_end)}`, async(error, result, fields) =>{
                if(!error){
                    if(result.length === 0){
                        await connection.query(`Insert into reservas (id_espacio, id_usuario, fecha, hora_entrada, hora_salida, notas) values (${connection.escape(space_id)}, ${connection.escape(client_id)}, ${connection.escape(date_booking)}, ${connection.escape(hour_start)}, ${connection.escape(hour_end)}, ${connection.escape(note)})`,async(error, result, fields) =>{
                            if(!error){
                                res.json({message: "0"})
                            }else{
                                res.json({message: "4"})
                            }
                        })
                    }else{
                        res.json({message: "3"})
                    }
                }else{
                    res.json({message: "2"})
                }
            })
        }else{
            res.json({message: "1"})
        }
    })
}

const deleteBooking = async(req, res) =>{
    jwt.verify(req.token, 'secretkey', async(error) =>{
        const {booking_id} = req.body
        if(!error){
            await connection.query(`select id_reserva from reservas where id_reserva = ${connection.escape(booking_id)}`, async(error, result, fields) =>{
                if(!error){
                    await connection.query(`Delete from reservas where id_reserva = ${connection.escape(booking_id)}`,async(error, result, fields) =>{
                        if(!error && result.affectedRows > 0){
                            res.json({message: "0"})
                        }else{
                            res.json({message: "2"})
                        }
                    })
                }else{
                    res.json({message: "2"})
                }
            })
        }else{
            res.json({message: "1"})
        }
    })
}

const getBookingList = async(req, res) =>{
    jwt.verify(req.token, 'secretkey', async(error) =>{
        if(!error){
            await connection.query(`Select * from reservas`, async(error, result, fields) =>{
                if(!error){
                    res.json(result)
                }else{
                    res.json({message: error})
                }
            })
        }else{
            res.json({message:error})
        }
    })
}

const searchBooking = async(req, res) =>{
    jwt.verify(req.token, 'secretkey', async(error)=>{
        if(!error){
            const {booking_id} = req.body
            await connection.query(`Select * from reservas where id_reserva = ${connection.escape(booking_id)}`, async(error, result, fields) =>{
                if(!error){
                    res.json(result)
                }else{
                    res.json({message:"2"})
                }
            })
        }else{
            res.json({message:"1"})
        }
    })
}

const modifyBooking = async(req, res) =>{
    jwt.verify(req.token, 'secretkey', async(error) =>{
        const {booking_id, space_id, date_booking, hour_start, hour_end, note} = req.body
        if(!error){
            await connection.query(`select id_reserva from reservas where id_reserva = ${connection.escape(booking_id)} `, async(error, result, fields) =>{
                if(!error){
                    if(result.length === 1){
                        await connection.query(`Select * from reservas where id_espacio = ${connection.escape(space_id)} and fecha = ${connection.escape(date_booking)} and (hora_entrada >= ${connection.escape(hour_start)} AND hora_entrada < ${connection.escape(hour_end)}) OR
                        (hora_salida > ${connection.escape(hour_start)} AND hora_salida <= ${connection.escape(hour_end)}) OR
                        (hora_entrada < ${connection.escape(hour_start)} AND hora_salida > ${connection.escape(hour_end)})`, async(error, result, fields) =>{
                            if(!error){
                                if(result.length === 0){
                                    await connection.query(`Update reservas set id_espacio = ${connection.escape(space_id)}, fecha = ${connection.escape(date_booking)}, hora_entrada = ${connection.escape(hour_start)}, hora_salida = ${connection.escape(hour_end)}, notas = ${connection.escape(note)} where id_reserva = ${connection.escape(booking_id)}`, async(error, result, fields) =>{
                                        if(!error){
                                            res.json({message: "0"})
                                        }else{
                                            res.json({message: "3"})
                                        }
                                    })
                                }else{
                                    await connection.query(`Select * from reservas where id_reserva = ${connection.escape(booking_id)}`, async(error, result, fields) =>{
                                        if(!error){
                                            if(result.length === 1){
                                                await connection.query(`Update reservas set id_espacio = ${connection.escape(space_id)}, fecha = ${connection.escape(date_booking)}, hora_entrada = ${connection.escape(hour_start)}, hora_salida = ${connection.escape(hour_end)}, notas = ${connection.escape(note)} where id_reserva = ${connection.escape(booking_id)}`, async(error, result, fields) =>{
                                                    if(!error){
                                                        res.json({message: "0"})
                                                    }else{
                                                        res.json({message: "3"})
                                                    }
                                                })
                                            }else{
                                                res.json({message: "1"})
                                            }
                                        }else{
                                            res.json({message: "2"})
                                        }
                                    })
                                }
                            }else{
                                res.json({message: "4"})
                            }
                        })
                    }else{
                        res.json({message: "3"})
                    }
                }else{
                    res.json({message: "2"})
                }
            })
        }else{
            res.json({message: error})
        }
    })
}

module.exports = {makeBooking, deleteBooking, getBookingList, modifyBooking, searchBooking}