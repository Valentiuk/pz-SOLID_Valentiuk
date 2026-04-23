// ISP: інтерфейс, який змушує реалізовувати непотрібні методи
export interface IOrderOperations {
    calculateTotal(items: Product[]): number;
    saveToDb(order: any): void;
    sendEmailReceipt(): void;
    printShippingLabel(): void; 
}

// LSP: Клас-нащадок ламає логіку базового класу
export class Product {
    constructor(public name: string, public price: number) {}
    
    getShippingCost(): number {
        return 50;
    }
}

export class DigitalProduct extends Product {
    getShippingCost(): number {
        // Порушення LSP: зміна очікуваної поведінки (викидання помилки замість числа)
        throw new Error("Цифрові товари не потребують доставки!"); 
    }
}

// DIP: Жорсткі залежності від конкретних класів
class MySQLDatabase {
    save(data: string) { console.log("Saved to MySQL: ", data); }
}

class StripePayment {
    pay(amount: number) { console.log(`Paid $${amount} via Stripe`); }
}

// SRP: Клас робить ВСЕ (розрахунки, БД, оплата, email)
// OCP: Для додавання нової знижки треба лізти в код цього класу і додавати if/else
export class OrderProcessor implements IOrderOperations {
    public processOrder(items: Product[], isVip: boolean) {
        // SRP порушення (розрахунок) + OCP порушення (хардкод знижок)
        let total = this.calculateTotal(items);
        if (isVip) {
            total = total * 0.8; // Знижка 20%
        } else {
            total = total * 0.95; // Знижка 5%
        }

        // DIP порушення: Пряме створення екземплярів
        const payment = new StripePayment();
        payment.pay(total);

        const db = new MySQLDatabase();
        this.saveToDb(items);

        this.sendEmailReceipt();
        
        // Може впасти, якщо серед товарів є DigitalProduct (LSP)
        items.forEach(item => console.log(item.getShippingCost()));
    }

    calculateTotal(items: Product[]): number {
        return items.reduce((sum, item) => sum + item.price, 0);
    }

    saveToDb(order: any): void { console.log("Saving...", order); }
    sendEmailReceipt(): void { console.log("Sending email..."); }
    
    printShippingLabel(): void {
        // Порушення ISP: якщо замовлення лише цифрове, цей метод не має сенсу
        console.log("Printing label...");
    }
}