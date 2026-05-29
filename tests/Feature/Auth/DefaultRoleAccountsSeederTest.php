<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DefaultRoleAccountsSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_default_super_admin_and_kasir_accounts(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@koperasi.test',
            'role' => UserRole::SuperAdmin->value,
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'kasir@koperasi.test',
            'role' => UserRole::Kasir->value,
        ]);

        $this->assertTrue(
            User::where('email', 'admin@koperasi.test')->exists()
        );

        $this->assertTrue(
            User::where('email', 'kasir@koperasi.test')->exists()
        );
    }
}
