import os
import sys
import subprocess

def run():
    try:
        print("Checking dependencies...")
        try:
            import fastapi
            import uvicorn
        except ImportError:
            print("Installing missing dependencies...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        
        print("Initializing database...")
        subprocess.check_call([sys.executable, "init_db.py"])
        
        print("Seeding database...")
        subprocess.check_call([sys.executable, "seed.py"])
        
        print("\n🚀 Starting MeterFlow Backend on http://localhost:8002")
        print("Press CTRL+C to stop the server safely.\n")
        
        # Run main.py and catch the interrupt
        subprocess.run([sys.executable, "main.py"])

    except KeyboardInterrupt:
        print("\n\n✅ MeterFlow Backend stopped safely.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run()
