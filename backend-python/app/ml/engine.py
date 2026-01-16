import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import Ridge
from typing import List, Dict, Any

class MLEngine:
    def __init__(self, workouts: List[Dict[str, Any]]):
        self.df = pd.DataFrame(workouts)
        if not self.df.empty:
            # Convert date to datetime
            self.df['date'] = pd.to_datetime(self.df['date'])
            # Calculate load
            self.df['load'] = self.df['duration'] * self.df['intensity']

    def analyze_weaknesses(self) -> List[str]:
        if self.df.empty:
            return ["No data available to analyze weaknesses."]
        
        # Simple distribution analysis: Least trained disciplines
        discipline_stats = self.df.groupby('discipline')['duration'].sum()
        all_disciplines = [
            'Boxing', 'Wrestling', 'BJJ', 'Muay Thai', 
            'Strength & Conditioning', 'Cardio', 'Mobility', 
            'Sprints'
        ]
        
        insights = []
        
        # 1. Identify neglected disciplines (never tried)
        trained_disciplines = discipline_stats.index.tolist()
        neglected = [d for d in all_disciplines if d not in trained_disciplines]
        
        if neglected:
            insights.append(f"Consider trying: {', '.join(neglected[:3])}")
        else:
            # 2. Identify underrepresented disciplines (< 10% of total time)
            total_duration = discipline_stats.sum()
            underrepresented = []
            for d in all_disciplines:
                d_duration = discipline_stats.get(d, 0)
                percentage = (d_duration / total_duration) * 100
                if percentage < 10:
                    underrepresented.append((d, percentage))
            
            if underrepresented:
                # Sort by lowest percentage first
                underrepresented.sort(key=lambda x: x[1])
                weak_areas = [f"{d} ({p:.0f}%)" for d, p in underrepresented[:3]]
                insights.append(f"Underrepresented areas: {', '.join(weak_areas)}")
        
        # 2. Identify 'High Intensity, Low Duration' vs 'Low Intensity, High Duration' outliers
        # We can use clustering here if we have enough data (e.g. > 10 workouts)
        if len(self.df) > 10:
            # Feature engineering for clustering
            # We want to cluster sessions to see if there's a pattern user is stuck in
            features = self.df[['duration', 'intensity']]
            kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
            self.df['cluster'] = kmeans.fit_predict(features)
            
            # Check cluster centers
            centers = kmeans.cluster_centers_
            # If all centers are low duration, suggest endurance
            if np.all(centers[:, 0] < 60):
                insights.append("Most sessions are under 60 mins. Consider adding long-form endurance training.")
            
            # If all centers are low intensity, suggest intensity
            if np.all(centers[:, 1] < 7):
                insights.append("Intensity seems moderate. Push for higher intensity (8-10) in some sessions.")

        return insights

    def predict_burnout(self) -> Dict[str, Any]:
        if len(self.df) < 5:
            return {"risk": "Unknown", "reason": "Not enough data"}
            
        # Analyze Load Trend
        # Moving Average of Load (7 days)
        self.df = self.df.sort_values('date')
        daily_load = self.df.set_index('date').resample('D')['load'].sum().fillna(0)
        
        rolling_7 = daily_load.rolling(window=7).mean()
        rolling_28 = daily_load.rolling(window=28).mean()
        
        # Acute:Chronic Workload Ratio (ACWR) - standard sports science metric
        # A ratio > 1.3 - 1.5 indicates high injury risk
        
        if len(rolling_28) < 28:
             # Fallback regression if not enough history for ACWR
             return {"risk": "Low", "reason": "Building baseline"}

        current_acwr = rolling_7.iloc[-1] / (rolling_28.iloc[-1] + 1e-6) # avoid div by zero
        
        risk = "Low"
        reason = "Training load is balanced."
        
        if current_acwr > 1.5:
            risk = "High"
            reason = f"Acute load is {current_acwr:.2f}x your chronic load. High injury risk! Taper recommended."
        elif current_acwr > 1.2:
            risk = "Moderate"
            reason = f"Training load is ramping up ({current_acwr:.2f}x). Monitor fatigue."
            
        return {"risk": risk, "reason": reason, "acwr": round(current_acwr, 2)}
        
    def get_recommended_focus(self) -> str:
        if self.df.empty:
            return "General Conditioning"
            
        # Suggest balancing the mix
        # If striker -> suggest grappling
        # If grappler -> suggest striking
        
        striking = ['Boxing', 'Muay Thai']
        grappling = ['Wrestling', 'BJJ']
        
        counts = self.df['discipline'].value_counts()
        
        striking_count = sum(counts.get(d, 0) for d in striking)
        grappling_count = sum(counts.get(d, 0) for d in grappling)
        
        if striking_count > grappling_count * 2:
            return "Grappling (Balance)"
        if grappling_count > striking_count * 2:
            return "Striking (Balance)"
            
        return "Maintain Mix"

