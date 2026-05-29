<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_kasir_can_access_pos_and_transactions_only(): void
    {
        $kasir = User::factory()->create([
            'role' => UserRole::Kasir,
        ]);

        $this->actingAs($kasir)->get(route('pos.index'))->assertOk();
        $this->actingAs($kasir)->get(route('transactions.index'))->assertOk();

        $this->actingAs($kasir)->get(route('dashboard'))->assertForbidden();
        $this->actingAs($kasir)->get(route('products.index'))->assertForbidden();
        $this->actingAs($kasir)->get(route('reports.index'))->assertForbidden();
        $this->actingAs($kasir)->get(route('users.index'))->assertForbidden();
        $this->actingAs($kasir)->get(route('settings.index'))->assertForbidden();
    }

    public function test_super_admin_can_access_all_protected_pages(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $this->actingAs($superAdmin)->get(route('dashboard'))->assertOk();
        $this->actingAs($superAdmin)->get(route('pos.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('transactions.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('products.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('reports.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('users.index'))->assertOk();
        $this->actingAs($superAdmin)->get(route('settings.index'))->assertOk();
    }
}
