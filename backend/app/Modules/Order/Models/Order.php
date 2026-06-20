<?php

namespace App\Modules\Order\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_PAID            = 'paid';
    public const STATUS_PROCESSING      = 'processing';
    public const STATUS_SHIPPED         = 'shipped';
    public const STATUS_DELIVERED       = 'delivered';
    public const STATUS_CANCELLED       = 'cancelled';
    public const STATUS_EXPIRED         = 'expired';

    public const VALID_TRANSITIONS = [
        self::STATUS_PENDING_PAYMENT => [self::STATUS_PAID, self::STATUS_CANCELLED, self::STATUS_EXPIRED],
        self::STATUS_PAID            => [self::STATUS_PROCESSING, self::STATUS_CANCELLED],
        self::STATUS_PROCESSING      => [self::STATUS_SHIPPED],
        self::STATUS_SHIPPED         => [self::STATUS_DELIVERED],
        self::STATUS_DELIVERED       => [],
        self::STATUS_CANCELLED       => [],
        self::STATUS_EXPIRED         => [],
    ];

    public const CANCELLABLE_STATUSES = [
        self::STATUS_PENDING_PAYMENT,
        self::STATUS_PAID,
    ];

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'total_amount',
        'recipient_name',
        'street_address',
        'city',
        'postal_code',
        'tracking_number',
        'status_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'total_amount'     => 'decimal:2',
            'status_updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(\App\Modules\User\Models\User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::VALID_TRANSITIONS[$this->status] ?? []);
    }

    public function isCancellable(): bool
    {
        return in_array($this->status, self::CANCELLABLE_STATUSES);
    }
}
