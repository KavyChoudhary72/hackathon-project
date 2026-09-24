@echo off
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
"C:\Users\user\AppData\Local\Python\pythoncore-3.14-64\python.exe" -m uvicorn main:app --reload --port 8001
pause
