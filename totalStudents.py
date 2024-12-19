import openpyxl
import sys
import json

data_json = sys.argv[1]
data = json.loads(data_json)

details = data['details']
sem = details[0].get("sem")

# Load the existing workbook and get the sheet containing the data
input_file = '.\\uploadedExcels\\S'+str(sem)+'.xlsx'  # Replace with your actual file path
wb = openpyxl.load_workbook(input_file)
ws = wb.active  # Assuming the data is in the active sheet

# Read the column with the names and alphanumeric codes (assuming it's in the first column)
data = []
for row in ws.iter_rows(min_col=1, max_col=1, min_row=1):
    for cell in row:
        if cell.value:  # Only count non-empty values
            data.append(cell.value)

# Get the total count of students
total_students = len(data)

print(total_students)