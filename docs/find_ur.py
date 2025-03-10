import csv
import json
from typing import List, Dict, TypedDict

class WordPair(TypedDict):
    prime: str
    target: str

def read_csv_pairs(file_path: str, has_extra_column: bool = False) -> List[WordPair]:
    pairs: List[WordPair] = []
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:  # Changed to utf-8-sig to handle BOM
            # Read and print the first few lines for debugging
            print(f"\nReading {file_path}:")
            first_lines = [next(f) for _ in range(3)]
            print("First 3 lines:")
            for line in first_lines:
                print(line.strip())
            
            # Reset file pointer
            f.seek(0)
            
            # Read CSV
            reader = csv.DictReader(f)
            print(f"Column names: {reader.fieldnames}")
            
            for row in reader:
                try:
                    pair = {
                        'prime': row['prime'],
                        'target': row['target']
                    }
                    pairs.append(pair)
                except KeyError as e:
                    print(f"Error processing row: {row}")
                    print(f"Available keys: {list(row.keys())}")
                    raise
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        raise
        
    print(f"Successfully read {len(pairs)} pairs from {file_path}")
    return pairs

def find_unique_pairs(full_list: List[WordPair], sr_list: List[WordPair], no_list: List[WordPair]) -> List[WordPair]:
    # Create lists of prime-target pairs from SR and NO lists
    sr_pairs = [(pair['prime'], pair['target']) for pair in sr_list]
    no_pairs = [(pair['prime'], pair['target']) for pair in no_list]
    
    print(f"\nTotal of {len(sr_pairs)} pairs in SR list")
    print(f"Total of {len(no_pairs)} pairs in NO list")
    
    # Filter full list to find pairs that are not in either SR or NO lists
    unique_pairs = [
        pair for pair in full_list 
        if (pair['prime'], pair['target']) not in sr_pairs 
        and (pair['prime'], pair['target']) not in no_pairs
    ]
    
    return unique_pairs

if __name__ == "__main__":
    # Read all CSV files
    print("Starting to read CSV files...")
    SR_LIST = read_csv_pairs('docs/SR.csv', has_extra_column=True)
    NO_LIST = read_csv_pairs('docs/NO.csv')
    FULL_LIST = read_csv_pairs('docs/まとめ.csv')
    
    # Find unique pairs
    print("\nFinding unique pairs...")
    unique_pairs = find_unique_pairs(FULL_LIST, SR_LIST, NO_LIST)
    
    # Write results to files
    print("\nWriting results to files...")
    
    # Write JSON
    with open('docs/ur_incr.json', 'w', encoding='utf-8') as f:
        json.dump(unique_pairs, f, ensure_ascii=False, indent=2)
    
    # Write CSV
    with open('docs/UR.csv', 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['prime', 'target'])
        writer.writeheader()
        writer.writerows(unique_pairs)
    
    print(f"\nFound {len(unique_pairs)} UR pairs")
    print("Results have been written to:")
    print("- docs/ur_incr.json")
    print("- docs/UR.csv")