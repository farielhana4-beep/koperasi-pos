<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Kasir = 'kasir';

    public static function resolve(self|string|null $role): self
    {
        if ($role instanceof self) {
            return $role;
        }

        return self::tryFrom(strtolower(trim((string) $role))) ?? self::Kasir;
    }

    public static function homeRouteFor(self|string|null $role): string
    {
        return self::resolve($role)->homeRouteName();
    }

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::Kasir => 'Kasir',
        };
    }

    public function homeRouteName(): string
    {
        return match ($this) {
            self::SuperAdmin => 'dashboard',
            self::Kasir => 'pos.index',
        };
    }
}
