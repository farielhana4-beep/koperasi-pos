<?php

namespace App\Services\Settings;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

class SettingsService
{
    private const CACHE_KEY = 'koperasi_pos.settings';

    /**
     * Keys that should not be overwritten when the incoming value is empty.
     */
    private const PRESERVE_WHEN_EMPTY = [
        'midtrans_server_key',
        'midtrans_client_key',
    ];

    public function all(): array
    {
        if (! Schema::hasTable('settings')) {
            return [];
        }

        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            return Setting::query()
                ->get()
                ->mapWithKeys(fn (Setting $setting) => [
                    $setting->key => $this->castValue($setting->value, $setting->type),
                ])
                ->all();
        });
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->all()[$key] ?? $default;
    }

    public function boolean(string $key, bool $default = false): bool
    {
        return filter_var($this->get($key, $default), FILTER_VALIDATE_BOOLEAN);
    }

    public function imageUrl(string $key, string $fallback): string
    {
        $path = $this->get($key);

        if (blank($path)) {
            return $fallback;
        }

        return Storage::disk('public')->url($path);
    }

    public function frontend(): array
    {
        return [
            'branding' => [
                'app_name' => $this->get('app_name', config('app.name', 'Koperasi POS')),
                'school_name' => $this->get('school_name', ''),
                'school_address' => $this->get('school_address', ''),
                'school_phone' => $this->get('school_phone', ''),
                'school_email' => $this->get('school_email', ''),
                'timezone' => $this->get('timezone', 'Asia/Jakarta'),
                'currency' => strtoupper((string) $this->get('currency', 'IDR')),
                'logo_url' => $this->imageUrl('app_logo_path', asset('images/brand-placeholder.svg')),
                'favicon_url' => $this->imageUrl('favicon_path', asset('favicon.svg')),
            ],
            'pos' => [
                'receipt_footer_text' => $this->get('receipt_footer_text', ''),
                'auto_print_receipt' => $this->boolean('pos_auto_print_receipt', true),
                'enable_qris' => $this->boolean('pos_enable_qris', true),
                'show_low_stock_warning' => $this->boolean('pos_show_low_stock_warning', true),
            ],
            'mail' => [
                'from_name' => $this->get('mail_from_name', config('mail.from.name')),
                'from_address' => $this->get('mail_from_address', config('mail.from.address')),
                'reply_to' => $this->get('mail_reply_to', config('mail.from.address')),
                'notifications_email' => $this->get('notifications_email', ''),
            ],
            'permissions' => [
                'self_registration' => $this->boolean('permission_self_registration', true),
                'cashier_refund' => $this->boolean('permission_cashier_refund', false),
            ],
            'backup' => [
                'enabled' => $this->boolean('backup_enabled', false),
                'schedule' => $this->get('backup_schedule', 'daily'),
                'retention_days' => (int) $this->get('backup_retention_days', 7),
            ],
            'appearance' => [
                'theme_mode' => $this->get('appearance_theme', 'dark'),
            ],
            'system' => [
                'maintenance_enabled' => $this->boolean('system_maintenance_enabled', false),
            ],
        ];
    }

    public function formData(): array
    {
        return [
            'branding' => [
                'app_name' => $this->get('app_name', config('app.name', 'Koperasi POS')),
                'school_name' => $this->get('school_name', ''),
                'school_address' => $this->get('school_address', ''),
                'school_phone' => $this->get('school_phone', ''),
                'school_email' => $this->get('school_email', ''),
                'timezone' => $this->get('timezone', 'Asia/Jakarta'),
                'currency' => strtoupper((string) $this->get('currency', 'IDR')),
                'logo_url' => $this->imageUrl('app_logo_path', asset('images/brand-placeholder.svg')),
                'favicon_url' => $this->imageUrl('favicon_path', asset('favicon.svg')),
            ],
            'pos' => [
                'receipt_footer_text' => $this->get('receipt_footer_text', ''),
                'auto_print_receipt' => $this->boolean('pos_auto_print_receipt', true),
                'enable_qris' => $this->boolean('pos_enable_qris', true),
                'show_low_stock_warning' => $this->boolean('pos_show_low_stock_warning', true),
            ],
            'midtrans' => [
                'server_key_configured' => filled($this->get('midtrans_server_key')),
                'client_key_configured' => filled($this->get('midtrans_client_key')),
                'merchant_id' => $this->get('midtrans_merchant_id', ''),
                'is_production' => $this->boolean('midtrans_is_production', false),
                'client_key' => $this->get('midtrans_client_key', ''),
            ],
            'mail' => [
                'from_name' => $this->get('mail_from_name', config('mail.from.name')),
                'from_address' => $this->get('mail_from_address', config('mail.from.address')),
                'reply_to' => $this->get('mail_reply_to', config('mail.from.address')),
                'notifications_email' => $this->get('notifications_email', ''),
            ],
            'permissions' => [
                'self_registration' => $this->boolean('permission_self_registration', true),
                'cashier_refund' => $this->boolean('permission_cashier_refund', false),
            ],
            'backup' => [
                'enabled' => $this->boolean('backup_enabled', false),
                'schedule' => $this->get('backup_schedule', 'daily'),
                'retention_days' => (int) $this->get('backup_retention_days', 7),
            ],
            'appearance' => [
                'theme_mode' => $this->get('appearance_theme', 'dark'),
            ],
            'system' => [
                'maintenance_enabled' => $this->boolean('system_maintenance_enabled', false),
            ],
        ];
    }

    public function update(array $data, array $files = [], ?User $actor = null): void
    {
        foreach ($data as $key => $value) {
            if (in_array($key, self::PRESERVE_WHEN_EMPTY, true) && blank($value)) {
                continue;
            }

            $this->persist($key, $value, $actor?->id);
        }

        foreach ($files as $key => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $currentPath = $this->get($key);
            $directory = $key === 'favicon_path'
                ? 'settings/favicons'
                : 'settings/logos';

            if (filled($currentPath)) {
                Storage::disk('public')->delete($currentPath);
            }

            $storedPath = $file->storePublicly($directory, 'public');

            $this->persist($key, $storedPath, $actor?->id, 'file');
        }

        Cache::forget(self::CACHE_KEY);
    }

    public function midtrans(): array
    {
        $isProduction = $this->boolean('midtrans_is_production', config('midtrans.is_production', false));

        return [
            'server_key' => (string) $this->get('midtrans_server_key', config('midtrans.server_key')),
            'client_key' => (string) $this->get('midtrans_client_key', config('midtrans.client_key')),
            'merchant_id' => (string) $this->get('midtrans_merchant_id', config('midtrans.merchant_id')),
            'is_production' => $isProduction,
            'snap_url' => $isProduction
                ? 'https://app.midtrans.com/snap/v1'
                : 'https://app.sandbox.midtrans.com/snap/v1',
        ];
    }

    private function persist(string $key, mixed $value, ?int $updatedBy = null, ?string $type = null): void
    {
        Setting::query()->updateOrCreate(
            ['key' => $key],
            [
                'group' => $this->groupForKey($key),
                'type' => $type ?? $this->typeForKey($key, $value),
                'value' => $this->normalizeValue($value, $type ?? $this->typeForKey($key, $value)),
                'updated_by' => $updatedBy,
            ],
        );
    }

    private function groupForKey(string $key): string
    {
        $groupMap = [
            'branding' => [
                'app_name',
                'school_name',
                'school_address',
                'school_phone',
                'school_email',
                'timezone',
                'currency',
                'app_logo_path',
                'favicon_path',
            ],
            'pos' => [
                'receipt_footer_text',
                'pos_auto_print_receipt',
                'pos_enable_qris',
                'pos_show_low_stock_warning',
            ],
            'midtrans' => [
                'midtrans_server_key',
                'midtrans_client_key',
                'midtrans_merchant_id',
                'midtrans_is_production',
            ],
            'mail' => [
                'mail_from_name',
                'mail_from_address',
                'mail_reply_to',
                'notifications_email',
            ],
            'backup' => [
                'backup_enabled',
                'backup_schedule',
                'backup_retention_days',
            ],
            'permissions' => [
                'permission_self_registration',
                'permission_cashier_refund',
            ],
            'appearance' => ['appearance_theme'],
            'system' => ['system_maintenance_enabled'],
        ];

        foreach ($groupMap as $group => $keys) {
            if (in_array($key, $keys, true)) {
                return $group;
            }
        }

        return 'general';
    }

    private function typeForKey(string $key, mixed $value): string
    {
        if (str_ends_with($key, '_path')) {
            return 'file';
        }

        if (is_bool($value)) {
            return 'boolean';
        }

        return match ($key) {
            'receipt_footer_text',
            'school_address' => 'text',
            'backup_retention_days' => 'integer',
            default => 'string',
        };
    }

    private function normalizeValue(mixed $value, string $type): string
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0',
            'integer' => (string) ((int) $value),
            default => (string) $value,
        };
    }

    private function castValue(?string $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            default => $value,
        };
    }
}
