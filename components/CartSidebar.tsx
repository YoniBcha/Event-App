import React from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

interface PackageSelection {
  id: string;
  packageDetails?: {
    packageName: string;
  };
  eventType?: string;
  price?: number;
  // Add other step-related properties here
}

interface CartOrder {
  id: string;
  steps: PackageSelection[];
  isCompleted: boolean;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartOrders: CartOrder[];
  onRemoveOrder: (orderId: string) => void;
  onRemoveItem: (orderId: string, itemId: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartOrders,
  onRemoveOrder,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  // Calculate total items across all orders
  const totalItems = cartOrders.reduce(
    (sum, order) => sum + order.steps.length,
    0
  );

  // Calculate total price across all orders
  const totalPrice = cartOrders.reduce(
    (sum, order) =>
      sum +
      order.steps.reduce((orderSum, item) => orderSum + (item.price || 0), 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({totalItems})</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {cartOrders.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-6">
              {cartOrders.map((order) => (
                <div key={order.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">
                      Order {order.id}{" "}
                      {order.isCompleted ? "(Completed)" : "(In Progress)"}
                    </h3>
                    <button
                      onClick={() => onRemoveOrder(order.id)}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <FaTrash size={12} /> Remove
                    </button>
                  </div>

                  <ul className="space-y-3 pl-2">
                    {order.steps.map((item) => (
                      <li key={item.id} className="border-l-2 pl-3 py-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">
                              {item.packageDetails?.packageName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.eventType}
                            </p>
                            <p className="text-sm">
                              Price: {item.price || 0} SR
                            </p>
                          </div>
                          {!order.isCompleted && (
                            <button
                              onClick={() => onRemoveItem(order.id, item.id)}
                              className="text-red-300 hover:text-red-500"
                            >
                              <FaTimes size={14} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Total:</span>
            <span className="font-bold">{totalPrice} SR</span>
          </div>
          <button
            className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
            disabled={cartOrders.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
