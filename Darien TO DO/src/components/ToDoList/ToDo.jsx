
import {Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import "./ToDo.css"
import DBConsults from '../services/consultas.js'
import Swal from "sweetalert2";


function ToDo() {

  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const [Consultas, SetConsultas]=useState([])
  
  let navigate = useNavigate();

  let Consulta = "";
      
  useEffect(() => {
    
    async function fetchDataUsers() {
      
      const Datos = await DBConsults.getConsults()
        
      SetConsultas(Datos)
    };

    fetchDataUsers()

  }, [])

  function btnSalir() {
    Swal.fire({
      title: "Cerrar sesión?",
      text: "",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar!"

  }).then((result) => {

      if (result.isConfirmed) {
        setTimeout(() => {
          navigate("/")
        }, 400);
        
      }
  })
  }

  function addTarea() {
      

      Swal.fire({
        title: 'Hacer Consulta',
        html: `
            
            <textarea id="consulta" class="swal2-textarea" placeholder="Escriba su Consulta"></textarea>
            
        `,
        showCancelButton: true,
        confirmButtonText: 'Enviar',

        focusConfirm: false,
        preConfirm: () => {

            const consulta = document.getElementById('consulta').value;
            Consulta = consulta;  

            if (!Consulta) {
                Swal.showValidationMessage('Por favor, escriba su Consulta.');
            }
            let estado = "pendiente"
            DBConsults.postConsults(usuarioActual,consulta,estado)
            
            
            return { Consulta };
        }
    }).then((result) => {
        
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Consulta enviada',
                icon: 'success',
                showConfirmButton: false
            })
            
            setTimeout(() => {
              location.reload()
            }, 1000);
        }
    });
  }


    function inputCheck(usuario,consulta,id) {

      if(usuarioActual != usuario) {
        Swal.fire({
          title: "No tienes permiso para completar esta consulta!",
          icon: "warning"
        }).then(() => {
          
          location.reload()
  
        });
      }
      else {
        let estado = "completada"
        DBConsults.updateConsults(usuarioActual,consulta,estado,id)
  
            Swal.fire({
                title: "Consulta completada",
                icon: "success",
                draggable: true,
                showConfirmButton: false
            })
  
            setTimeout(() => {
                location.reload()
            }, 1000);
      }


    }
    
    function btnEliminar(usuario,id) {

      if(usuarioActual != usuario) {
        Swal.fire({
          title: "No tienes permiso para eliminar esta consulta!",
          icon: "warning"
        }).then(() => {
          
          location.reload()
  
        });
      }
      else {
        DBConsults.deleteConsults(id)
  
        Swal.fire({
          title: "Consulta eliminada correctamente!",
          icon: "success"
        }).then(() => {
          
          location.reload()
  
        });

      }
    }

    function btnEditar(consult,usuario,id) {
      
      if(usuarioActual != usuario) {
        Swal.fire({
          title: "No tienes permiso para editar esta consulta!",
          icon: "warning"
        }).then(() => {
          
          location.reload()
  
        });
      }
      else {

        Swal.fire({
          title: 'Editar tarea',
          html: `
              
              <textarea id="consulta" class="swal2-textarea"></textarea>
              
          `,
          showCancelButton: true,
          confirmButtonText: 'Confirmar',

          focusConfirm: false,
          preConfirm: () => {

            const Consulta = document.getElementById('consulta').value;

            if (!Consulta) {
                Swal.showValidationMessage('Por favor, escriba su Consulta.');
            }
            let estado = "pendiente"
            DBConsults.updateConsults(usuarioActual,Consulta,estado,id)
            setTimeout(() => {
                
              location.reload()
            }, 700);
            
            return { Consulta };
          }
        }).then((result) => {
            
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Consulta editada con exito',
                    icon: 'success',
                    showConfirmButton: false
                })
                
            }
        });
      }

    }


  return (

  <main>  

    <h1>Consultas</h1>

    <button className='btnSalir' onClick={btnSalir}>
      <span>Salir</span>
      <svg width="15" height="15" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linejoin="round" stroke-linecap="round"></path>
      </svg>
    </button>

    

    <button className='btnAgregar' onClick={addTarea}>Hacer una consulta </button> <br />
    
    <p className='Contador' >Consultas: {Consultas.filter(consulta => consulta.estado === "pendiente").length}</p>

    <section className='contenedorConsultas'>
    
        {Consultas.filter(consulta => consulta.estado === "pendiente").length === 0 ? (
          
            <p align="center">No hay consultas pendientes</p>
        ) : (
          
          Consultas.filter(consulta => consulta.estado === "pendiente").map((consulta, index) => (

              
                <div className='DivConsulta' key={index}>
                  
                    <input
                        className='check' type="checkbox" onClick={e => inputCheck(consulta.usuario,consulta.consulta, consulta.id)}
                    />

                    <p className='pNombre'>{consulta.usuario} </p>


                    <button class="edit-button" onClick={e => btnEditar(consulta.consulta,consulta.usuario,consulta.id)}>
                      <svg class="edit-svgIcon" viewBox="0 0 512 512">
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path> 


                      </svg>
                    </button>

                    <button class="delete-button" onClick={e => btnEliminar(consulta.usuario,consulta.id)}>
                      <svg class="delete-svgIcon" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>

                    <p className='pConsulta'>{consulta.consulta} <br /> </p>
                    
                </div>
                
            ))
            
        )}      
        
    </section>
    <p className='Contador2' >Consultas completadas: {Consultas.filter(consulta => consulta.estado === "completada").length}</p>


  </main>


  )
}

export default ToDo
