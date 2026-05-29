<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use App\Services\Settings\SettingsService;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(SettingsService $settings): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => $settings->formData(),
        ]);
    }

    public function update(UpdateSettingsRequest $request, SettingsService $settings)
    {
        $validated = $request->validated();

        $settings->update(
            [
                'app_name' => $validated['app_name'],
                'school_name' => $validated['school_name'] ?? '',
                'school_address' => $validated['school_address'] ?? '',
                'school_phone' => $validated['school_phone'] ?? '',
                'school_email' => $validated['school_email'] ?? '',
                'timezone' => $validated['timezone'] ?? 'Asia/Jakarta',
                'currency' => strtoupper($validated['currency'] ?? 'IDR'),
                'receipt_footer_text' => $validated['receipt_footer_text'] ?? '',
                'pos_auto_print_receipt' => (bool) ($validated['pos_auto_print_receipt'] ?? false),
                'pos_enable_qris' => (bool) ($validated['pos_enable_qris'] ?? false),
                'pos_show_low_stock_warning' => (bool) ($validated['pos_show_low_stock_warning'] ?? false),
                'midtrans_merchant_id' => $validated['midtrans_merchant_id'] ?? '',
                'midtrans_is_production' => (bool) ($validated['midtrans_is_production'] ?? false),
                'mail_from_name' => $validated['mail_from_name'] ?? '',
                'mail_from_address' => $validated['mail_from_address'] ?? '',
                'mail_reply_to' => $validated['mail_reply_to'] ?? '',
                'notifications_email' => $validated['notifications_email'] ?? '',
                'backup_enabled' => (bool) ($validated['backup_enabled'] ?? false),
                'backup_schedule' => $validated['backup_schedule'] ?? 'daily',
                'backup_retention_days' => (int) ($validated['backup_retention_days'] ?? 7),
                'permission_self_registration' => (bool) ($validated['permission_self_registration'] ?? false),
                'permission_cashier_refund' => (bool) ($validated['permission_cashier_refund'] ?? false),
                'appearance_theme' => $validated['appearance_theme'],
                'system_maintenance_enabled' => (bool) ($validated['system_maintenance_enabled'] ?? false),
                'midtrans_server_key' => $validated['midtrans_server_key'] ?? '',
                'midtrans_client_key' => $validated['midtrans_client_key'] ?? '',
            ],
            [
                'app_logo_path' => $request->file('app_logo'),
                'favicon_path' => $request->file('favicon'),
            ],
            $request->user(),
        );

        return redirect()->route('settings.index')->with('success', 'Settings updated successfully.');
    }
}
