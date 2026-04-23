import { 
    IPurchasable, IShippable, IOrderRepository, 
    IPaymentProcessor, INotificationService, IDiscountStrategy 
} from '../interfaces';

// LSP Вирішено: Цифрові і фізичні товари не мають конфліктів у контрактах
export class PhysicalItem implements IPurchasable, IShippable {
    constructor(public name: string, public price: number, private weight: number) {}
    getShippingWeight(): number { return this.weight; }
}

export class DigitalItem implements IPurchasable {
    constructor(public name: string, public price: number) {}
    // Не реалізує IShippable, тому помилок зі спадкуванням немає
}

// OCP Вирішено: Нові знижки додаються створенням нових класів
export class VipDiscount implements IDiscountStrategy {
    applyDiscount(total: number): number { return total * 0.8; }
}

export class StandardDiscount implements IDiscountStrategy {
    applyDiscount(total: number): number { return total * 0.95; }
}

export class NoDiscount implements IDiscountStrategy {
    applyDiscount(total: number): number { return total; }
}

// SRP: Тільки розрахунок вартості
export class OrderCalculator {
    static calculateTotal(items: IPurchasable[], discountStrategy: IDiscountStrategy): number {
        const subtotal = items.reduce((sum, item) => sum + item.price, 0);
        return discountStrategy.applyDiscount(subtotal);
    }
}

// SRP: Тільки координація процесу замовлення
// DIP: Відсутність прямих залежностей (new DB()), тільки ін'єкції через конструктор
export class OrderService {
    constructor(
        private repository: IOrderRepository,
        private paymentProcessor: IPaymentProcessor,
        private notificationService: INotificationService
    ) {}

    public checkout(items: IPurchasable[], discountStrategy: IDiscountStrategy): void {
        const total = OrderCalculator.calculateTotal(items, discountStrategy);
        
        const paymentSuccess = this.paymentProcessor.pay(total);
        if (!paymentSuccess) throw new Error("Payment failed");

        this.repository.save({ items, total });
        this.notificationService.notify(`Order successfully placed. Total: $${total}`);
    }
}