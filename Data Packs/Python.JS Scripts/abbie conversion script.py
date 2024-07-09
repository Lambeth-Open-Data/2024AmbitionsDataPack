import pandas as pd
import os

def csv_to_json(folder_path, output_folder):
    # Ensure output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Initialize counter variable
    file_count = 0

    # Iterate over all CSV files in the specified folder
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.csv'):
            file_path = os.path.join(folder_path, file_name)
            # Read CSV file
            df = pd.read_csv(file_path)
            # Convert DataFrame to JSON
            json_path = os.path.join(output_folder, file_name.replace('.csv', '.json'))
            df.to_json(json_path, orient='records', lines=True)
            print(f'Converted {file_name} to JSON.')
            
            # Increment file count
            file_count += 1

    # Print total number of files processed
    print(f'Conversion complete! Processed {file_count} files.')


# Example usage
folder_path = 'C:/Users/Asancto/OneDrive - Lambeth Council/Data Packs 2024/Web App Draft/Data/Ambition 3/Education/previous data'
output_folder = 'C:/Users/Asancto/OneDrive - Lambeth Council/Data Packs 2024/Web App Draft/Python.JS Scripts/Clean Data'
csv_to_json(folder_path, output_folder)