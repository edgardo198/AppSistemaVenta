import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  totalIngresos: string="0";
  totalVenta: string="0";
  totalProductos: string="0"

  constructor(
    private _dashBoardServicio: DashBoardService
  ) { }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
  const canvas = document.getElementById('charBarras') as HTMLCanvasElement;
  if (!canvas) {
    console.error('El elemento canvas con ID "charBarras" no existe en el DOM.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas.');
    return;
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labelGrafico,
      datasets: [{
        label: "# de Ventas",
        data: dataGrafico,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

  ngOnInit(): void {
    this._dashBoardServicio.resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos=data.value.totalIngresos;
          this.totalVenta=data.value.totalVentas;
          this.totalProductos=data.value.totalProductos;
  
          const arrayData: any[]=data.value.ventasUltimaSemana;
          console.log(arrayData);

          const labelTemp = arrayData.map((value)=> value.fecha);
          const dataTemp = arrayData.map((value)=> value.total);

          this.mostrarGrafico(labelTemp, dataTemp);

        }
      }
    })
  }

}
