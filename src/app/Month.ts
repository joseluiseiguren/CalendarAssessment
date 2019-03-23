
export class Month {
    nombre: string;
    numero: number;
  
    constructor(nombre: string, numero: number) { 
      this.nombre = nombre;
      this.numero = numero;
    }
  }


  export enum WeekDays {
    SUNDAY = 0,
    MONDAY,
    TUESDAY,
    WENSDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
  }