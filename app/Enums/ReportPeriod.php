<?php

namespace App\Enums;

use Illuminate\Support\Carbon;

enum ReportPeriod: string
{
    case Daily = 'daily';
    case Weekly = 'weekly';
    case Monthly = 'monthly';

    public function label(): string
    {
        return match ($this) {
            self::Daily => 'Daily',
            self::Weekly => 'Weekly',
            self::Monthly => 'Monthly',
        };
    }

    public function range(): array
    {
        $now = now();

        return match ($this) {
            self::Daily => [$now->copy()->startOfDay(), $now->copy()],
            self::Weekly => [$now->copy()->startOfWeek(), $now->copy()],
            self::Monthly => [$now->copy()->startOfMonth(), $now->copy()],
        };
    }

    public static function fromRequest(?string $value): self
    {
        return self::tryFrom($value ?? '') ?? self::Monthly;
    }

    public function bucketLabel(Carbon $date): string
    {
        return match ($this) {
            self::Daily => $date->format('H:00'),
            self::Weekly => $date->format('D'),
            self::Monthly => $date->format('j M'),
        };
    }
}
