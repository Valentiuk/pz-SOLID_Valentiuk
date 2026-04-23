import { OrderService, PhysicalItem, DigitalItem, VipDiscount } from '../src/refactored/OrderManagement';
import { IOrderRepository, IPaymentProcessor, INotificationService } from '../src/interfaces';

describe('OrderService (Refactored SOLID)', () => {
    let mockRepo: jest.Mocked<IOrderRepository>;
    let mockPayment: jest.Mocked<IPaymentProcessor>;
    let mockNotifier: jest.Mocked<INotificationService>;
    let orderService: OrderService;

    beforeEach(() => {
        mockRepo = { save: jest.fn() };
        mockPayment = { pay: jest.fn().mockReturnValue(true) };
        mockNotifier = { notify: jest.fn() };

        orderService = new OrderService(mockRepo, mockPayment, mockNotifier);
    });

    it('should process order correctly with VIP discount', () => {
        const items = [
            new PhysicalItem("Laptop", 1000, 2.5),
            new DigitalItem("Software License", 100)
        ];
        const vipDiscount = new VipDiscount(); 
        
        orderService.checkout(items, vipDiscount);

        expect(mockPayment.pay).toHaveBeenCalledWith(880);
        expect(mockRepo.save).toHaveBeenCalled();
        expect(mockNotifier.notify).toHaveBeenCalledWith('Order successfully placed. Total: $880');
    });

    it('should throw error if payment fails', () => {
        mockPayment.pay.mockReturnValue(false);
        const items = [new DigitalItem("Game", 50)];
        const vipDiscount = new VipDiscount();

        expect(() => orderService.checkout(items, vipDiscount)).toThrow("Payment failed");
        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});