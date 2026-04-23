// ISP: Розділені інтерфейси замість одного великого
export interface IPurchasable {
    name: string;
    price: number;
}

export interface IShippable {
    getShippingWeight(): number;
}

// DIP: Абстракції для зовнішніх сервісів
export interface IOrderRepository {
    save(orderInfo: any): void;
}

export interface IPaymentProcessor {
    pay(amount: number): boolean;
}

export interface INotificationService {
    notify(message: string): void;
}

// OCP: Стратегія для розрахунку знижок
export interface IDiscountStrategy {
    applyDiscount(total: number): number;
}