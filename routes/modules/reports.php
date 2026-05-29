<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:super_admin'])->prefix('reports')->name('reports.')->group(function () {
    Route::get('/', [ReportController::class, 'index'])->name('index');
    Route::get('/export/pdf', [ReportController::class, 'exportPdf'])->name('export.pdf');
    Route::get('/export/excel', [ReportController::class, 'exportExcel'])->name('export.excel');
});
