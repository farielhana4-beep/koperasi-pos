<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class DefaultSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'app_name' => config('app.name', 'Koperasi POS'),
            'school_name' => 'Koperasi Sekolah',
            'school_address' => 'Jl. Pendidikan No. 1',
            'school_phone' => '0812-3456-7890',
            'school_email' => 'koperasi@sekolah.test',
            'timezone' => 'Asia/Jakarta',
            'currency' => 'IDR',
            'receipt_footer_text' => 'Terima kasih telah berbelanja di koperasi sekolah kami.',
            'pos_auto_print_receipt' => '1',
            'pos_enable_qris' => '1',
            'pos_show_low_stock_warning' => '1',
            'midtrans_merchant_id' => '',
            'midtrans_is_production' => '0',
            'mail_from_name' => 'Koperasi POS',
            'mail_from_address' => 'noreply@koperasi.test',
            'mail_reply_to' => 'support@koperasi.test',
            'notifications_email' => 'admin@koperasi.test',
            'backup_enabled' => '1',
            'backup_schedule' => 'daily',
            'backup_retention_days' => '14',
            'permission_self_registration' => '0',
            'permission_cashier_refund' => '0',
            'appearance_theme' => 'dark',
            'system_maintenance_enabled' => '0',
        ];

        $groupMap = [
            'branding' => [
                'app_name',
                'school_name',
                'school_address',
                'school_phone',
                'school_email',
                'timezone',
                'currency',
            ],
            'pos' => [
                'receipt_footer_text',
                'pos_auto_print_receipt',
                'pos_enable_qris',
                'pos_show_low_stock_warning',
            ],
            'midtrans' => [
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
            'appearance' => [
                'appearance_theme',
            ],
            'system' => [
                'system_maintenance_enabled',
            ],
        ];

        $booleanKeys = [
            'pos_auto_print_receipt',
            'pos_enable_qris',
            'pos_show_low_stock_warning',
            'midtrans_is_production',
            'backup_enabled',
            'permission_self_registration',
            'permission_cashier_refund',
            'system_maintenance_enabled',
        ];

        foreach ($defaults as $key => $value) {
            $group = 'general';

            foreach ($groupMap as $groupName => $keys) {
                if (in_array($key, $keys, true)) {
                    $group = $groupName;
                    break;
                }
            }

            $type = in_array($key, $booleanKeys, true)
                ? 'boolean'
                : ($key === 'backup_retention_days'
                    ? 'integer'
                    : ($key === 'receipt_footer_text' || $key === 'school_address' ? 'text' : 'string'));

            Setting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'group' => $group,
                    'type' => $type,
                    'value' => $value,
                ],
            );
        }

        Cache::forget('koperasi_pos.settings');
    }
}
