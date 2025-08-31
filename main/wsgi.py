import sys
import os

# Add the parent directory to Python path so we can import from main
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main.app import app

if __name__ == "__main__":
    app.run() 