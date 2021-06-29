class Notifier {
    constructor() {
        this.observers = [];
    }

    // Subscribe una clase notificadora
    subscribe(c) {
        this.observers.push(c);
    }

    // Desubscribe la clase notificadora
    unsubscribe(c) {
        let index = this.observers.indexOf(c);
        if (index>-1){
            this.observers.splice(index,1)
        }
    }

    // Elimina a todos los subscriptores en la lista
    clearSubscribers() {
        this.observers = []
    }

    /* Llama a todos nuestros subscriptores
    */
    notify(mensaje) {
        this.observers.forEach(observer => {
            observer.update(mensaje).catch((e) => {
                console.log('No se pudo enviar notificacion. Error: '+e)
            });
        });
    }
}

export {Notifier}