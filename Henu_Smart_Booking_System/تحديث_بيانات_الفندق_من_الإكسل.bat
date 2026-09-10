@echo off
chcp 65001 > nul
title تحديث بيانات الفندق من الإكسل
cd /d "%~dp002_System_Engine_Core"
call run_init_hotel.bat
