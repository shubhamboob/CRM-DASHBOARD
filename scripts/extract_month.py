"""
extract_month.py — Auto-extract data from Overall_Draft sheet
Usage: python3 scripts/extract_month.py path/to/Overall_Collection_Summary_June_26.xlsx
Outputs JS snippet to paste into src/data/crmData.js
"""

import sys
import json
import pandas as pd
from pathlib import Path

def safe(v):
    if pd.isna(v): return 0
    try: return float(v)
    except: return str(v)

def extract(path):
    df = pd.read_excel(path, sheet_name='Overall_Draft', header=None)

    # Detect month name from filename
    fname = Path(path).stem
    parts = fname.split('_')
    month_name = parts[-2] if len(parts) >= 2 else "Unknown"
    year = "2026"
    month_key = f"{month_name} {year}"

    # Date
    date_val = str(df.iloc[0, 8])[:10]

    # CRM summary
    crm_raw = str(df.iloc[2, 1])

    # Project rows 3-9
    projects = []
    for r in range(3, 10):
        proj = df.iloc[r, 11]
        if pd.notna(proj) and str(proj).strip() not in ['Total', 'NaN']:
            projects.append({
                'name': str(proj).strip(),
                'live_bookings': int(safe(df.iloc[r, 12])),
                'daily_collection': round(safe(df.iloc[r, 13]), 4),
                'monthly_collection': round(safe(df.iloc[r, 14]), 2),
                'monthly_registrations': int(safe(df.iloc[r, 15])),
                'demand_raised': round(safe(df.iloc[r, 16]), 2),
                'collection_till_date': round(safe(df.iloc[r, 17]), 2),
                'outstanding': round(safe(df.iloc[r, 18]), 2),
                'pending_reg': int(safe(df.iloc[r, 19])),
                'pending_reg_45d': int(safe(df.iloc[r, 20])),
                'reg_targets': int(safe(df.iloc[r, 21])),
            })

    # Total row
    total = {
        'live_bookings': int(safe(df.iloc[10, 12])),
        'daily_collection': round(safe(df.iloc[10, 13]), 4),
        'monthly_collection': round(safe(df.iloc[10, 14]), 2),
        'monthly_registrations': int(safe(df.iloc[10, 15])),
        'demand_raised': round(safe(df.iloc[10, 16]), 2),
        'collection_till_date': round(safe(df.iloc[10, 17]), 2),
        'outstanding': round(safe(df.iloc[10, 18]), 2),
        'pending_reg': int(safe(df.iloc[10, 19])),
        'pending_reg_45d': int(safe(df.iloc[10, 20])),
        'reg_targets': int(safe(df.iloc[10, 21])),
    }

    # Project TVA rows 19-26
    proj_names = ['Paradise','Parijat','Ananta','Vista','Avenue','Utopia','Enclave','Overall']
    project_tva = []
    for i, r in enumerate(range(19, 27)):
        target_val = round(safe(df.iloc[r, 13]), 2)
        achv_val = round(safe(df.iloc[r, 14]), 2)
        achv_pct = round(safe(df.iloc[r, 15]) * 100, 1) if safe(df.iloc[r, 15]) else 0
        project_tva.append({
            'name': proj_names[i] if i < len(proj_names) else f'Project{i}',
            'target': target_val,
            'achievement': achv_val,
            'achievement_pct': achv_pct,
            'forecast': round(safe(df.iloc[r, 16]), 2),
        })

    # Category TVA rows 19-24
    categories = ['Spill Over','OCR-Unregistered','OCR-New Bookings','Demand for Registration','Exp. Monthly Reg.','New Slab/Possession']
    category_tva = []
    for i, r in enumerate(range(19, 25)):
        category_tva.append({
            'category': categories[i],
            'target': round(safe(df.iloc[r, 23]), 2),
            'achievement': round(safe(df.iloc[r, 24]), 2),
            'achievement_pct': round(safe(df.iloc[r, 25]) * 100, 1) if safe(df.iloc[r, 25]) else 0,
        })

    # Overall CRM from row 26
    crm_target = round(safe(df.iloc[26, 13]), 2)
    crm_achv = round(safe(df.iloc[26, 14]), 2)
    crm_pct = round(crm_achv / crm_target * 100, 1) if crm_target else 0

    # Weekly forecast rows 53-57
    week_labels = ['W1','W2','W3','W4','W5']
    weekly_forecast = []
    for i, r in enumerate(range(53, 58)):
        weekly_forecast.append({'week': week_labels[i], 'target': round(safe(df.iloc[r, 12]), 3), 'achievement': round(safe(df.iloc[r, 13]), 3)})

    result = {
        'date': date_val,
        'crm_target': crm_target,
        'crm_achievement': crm_achv,
        'crm_pct': crm_pct,
        'projects': projects,
        'total': total,
        'project_tva': project_tva,
        'category_tva': category_tva,
        'weekly_forecast': weekly_forecast,
    }

    print(f'\n// ── Paste this into src/data/crmData.js inside monthsData object ──')
    print(f'  "{month_key}": {json.dumps(result, indent=4)},')
    print(f'\n// ── Also add to monthKeys array if needed ──')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/extract_month.py <path_to_xlsx>")
        sys.exit(1)
    extract(sys.argv[1])
