import { AgregarClaseAdminStrategy } from './AgregarClaseAdminStrategy';
import { AgregarClaseInstructorStrategy } from './AgregarClaseInstructorStrategy';
class StrategyManager{
    constructor(roll){
        if(roll==="Administrador"){
            this.strategy = new AgregarClaseAdminStrategy()
        }
        else{
            this.strategy = new AgregarClaseInstructorStrategy()
        }
    }

    //Setters
    setStrategy(strategy){
        this.strategy = strategy
    }

    setClase(clases){
        this.strategy.setClases(clases)
    }

    setNombreSala(nombreSala){
        this.strategy.setNombreSala(nombreSala)
    }

    //Getters
    getStrategy(){
        return this.strategy
    }

    getClase(){
        return this.strategy.getClases()
    }

    getNombreSala(){
        return this.strategy.getNombreSala()
    }

    //Funciones
    execute(){
        this.strategy.execute()
    }

    sleep(milliseconds){
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    
}
export {StrategyManager}