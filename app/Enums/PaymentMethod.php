<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case Qris = 'qris';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::Qris => 'QRIS',
        };
    }

    public static function values(): array
    {
        return array_map(static fn (self $method) => $method->value, self::cases());
    }
}
