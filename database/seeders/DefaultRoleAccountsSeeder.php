<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultRoleAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@koperasi.test',
                'role' => UserRole::SuperAdmin,
            ],
            [
                'name' => 'Kasir',
                'email' => 'kasir@koperasi.test',
                'role' => UserRole::Kasir,
            ],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make('password'),
                    'role' => $account['role'],
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
