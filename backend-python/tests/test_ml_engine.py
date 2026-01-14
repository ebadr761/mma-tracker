import pytest
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from app.ml.engine import MLEngine

# Fixture for sample workouts
@pytest.fixture
def sample_workouts():
    base_date = datetime.now()
    workouts = []
    
    # Create 30 days of data to allow for chronic load calculation
    for i in range(30):
        workouts.append({
            "discipline": "Boxing",
            "duration": 60,
            "intensity": 5, # Load = 300
            "date": (base_date - timedelta(days=i)).strftime('%Y-%m-%d'),
            "notes": "Steady state"
        })
    return workouts

def test_init_empty():
    engine = MLEngine([])
    assert engine.df.empty
    assert engine.get_recommended_focus() == "General Conditioning"

def test_analyze_weaknesses_empty():
    engine = MLEngine([])
    weaknesses = engine.analyze_weaknesses()
    assert "No data available" in weaknesses[0]

def test_analyze_weaknesses_identifies_neglected(sample_workouts):
    # All sample workouts are "Boxing"
    engine = MLEngine(sample_workouts)
    weaknesses = engine.analyze_weaknesses()
    
    # Should recommend neglected disciplines like Wrestling or BJJ
    assert any("Consider trying" in w for w in weaknesses)
    assert any("Wrestling" in w for w in weaknesses if "Consider trying" in w)

def test_predict_burnout_steady_state(sample_workouts):
    # Steady 300 load every day -> ACWR should be around 1.0 (Low risk)
    engine = MLEngine(sample_workouts)
    result = engine.predict_burnout()
    
    assert result['risk'] == "Low"
    assert result['acwr'] < 1.3

def test_predict_burnout_spike():
    base_date = datetime.now()
    workouts = []
    
    # Chronic load building (low intensity)
    for i in range(21, 50):
        workouts.append({
            "discipline": "Running",
            "duration": 30,
            "intensity": 3, # Load = 90
            "date": (base_date - timedelta(days=i)).strftime('%Y-%m-%d')
        })
        
    # Acute spike (last 7 days - High intensity)
    for i in range(7):
        workouts.append({
            "discipline": "Sparring",
            "duration": 90,
            "intensity": 9, # Load = 810
            "date": (base_date - timedelta(days=i)).strftime('%Y-%m-%d')
        })
        
    engine = MLEngine(workouts)
    result = engine.predict_burnout()
    
    # 810 avg acute vs ~90 avg chronic -> Huge Ratio (~9.0)
    assert result['risk'] == "High"
    assert result['acwr'] > 1.5

def test_recommended_focus_striker(sample_workouts):
    # All boxing
    engine = MLEngine(sample_workouts)
    focus = engine.get_recommended_focus()
    assert "Grappling" in focus

def test_recommended_focus_grappler():
    workouts = [
        {"discipline": "BJJ", "duration": 60, "intensity": 5, "date": "2024-01-01"},
        {"discipline": "Wrestling", "duration": 60, "intensity": 5, "date": "2024-01-02"},
        {"discipline": "BJJ", "duration": 60, "intensity": 5, "date": "2024-01-03"},
    ]
    engine = MLEngine(workouts)
    focus = engine.get_recommended_focus()
    assert "Striking" in focus
