// Clase padre
class Animal {
    constructor(nombre) {
      this.nombre = nombre;
    }
  
    hacerSonido() {
      console.log(`${this.nombre} hace un sonido.`);
    }
  }
  
  // Clase hija que hereda de Animal
  class Perro extends Animal {
    ladrar() {
      console.log(`${this.nombre} dice: ¡Guau!`);
    }
  }
  
  // Crear instancia de Perro
  const miPerro = new Perro("Firulais");
  
  miPerro.hacerSonido(); // Firulais hace un sonido.
  miPerro.ladrar(); // Firulais dice: ¡Guau!
  