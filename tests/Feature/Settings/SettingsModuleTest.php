<?php

namespace Tests\Feature\Settings;

use App\Enums\UserRole;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SettingsModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_update_settings_and_upload_branding_files(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create([
            'role' => UserRole::SuperAdmin,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)
            ->post(route('settings.update'), [
                'app_name' => 'Koperasi POS',
                'school_name' => 'SMA 1',
                'school_address' => 'Jl. Merdeka 1',
                'school_phone' => '08123456789',
                'school_email' => 'admin@example.test',
                'receipt_footer_text' => 'Terima kasih.',
                'pos_auto_print_receipt' => true,
                'pos_enable_qris' => true,
                'pos_show_low_stock_warning' => true,
                'midtrans_server_key' => 'server-key',
                'midtrans_client_key' => 'client-key',
                'midtrans_merchant_id' => 'merchant-1',
                'midtrans_is_production' => false,
                'appearance_theme' => 'dark',
                'system_maintenance_enabled' => false,
                'app_logo' => UploadedFile::fake()->image('logo.png', 512, 512),
                'favicon' => UploadedFile::fake()->image('favicon.png', 64, 64),
            ])
            ->assertRedirect(route('settings.index'));

        $this->assertDatabaseHas('settings', [
            'key' => 'app_name',
            'value' => 'Koperasi POS',
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'midtrans_server_key',
            'value' => 'server-key',
        ]);

        $this->assertTrue(Setting::query()->where('key', 'app_logo_path')->exists());
        $this->assertTrue(Setting::query()->where('key', 'favicon_path')->exists());

        $logoPath = Setting::query()->where('key', 'app_logo_path')->value('value');
        $faviconPath = Setting::query()->where('key', 'favicon_path')->value('value');

        Storage::disk('public')->assertExists($logoPath);
        Storage::disk('public')->assertExists($faviconPath);
    }

    public function test_kasir_cannot_access_settings(): void
    {
        $kasir = User::factory()->create([
            'role' => UserRole::Kasir,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($kasir)
            ->get(route('settings.index'))
            ->assertForbidden();
    }

    public function test_maintenance_mode_blocks_kasir_but_not_super_admin(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::SuperAdmin,
            'email_verified_at' => now(),
        ]);

        $kasir = User::factory()->create([
            'role' => UserRole::Kasir,
            'email_verified_at' => now(),
        ]);

        Setting::query()->updateOrCreate(
            ['key' => 'system_maintenance_enabled'],
            [
                'group' => 'system',
                'type' => 'boolean',
                'value' => '1',
            ],
        );

        $this->actingAs($kasir)
            ->get(route('dashboard'))
            ->assertRedirect(route('maintenance'));

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk();
    }
}
