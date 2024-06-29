from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import camelot as cam
import pandas as pd
import io

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload():
    pdf_files = [
        request.files.get('file1'),
        request.files.get('file2'),
        request.files.get('file3')
    ]
    filebac = request.files.get('fileBac')

    results = []  # Initialize results list to store text and table results for each PDF
    total_sum_accumulator = 0
    column2_sum_accumulator = 0
    moyenne_totale = 0
    score_accumulator = 0
    score_bac = 0
    scoreanglais = 0
    redoublant_count = 0
    similar_count = 0

    # Read the content of fileBac if it exists
    filebac_content = filebac.read() if filebac else None

    # Process the three primary PDF files
    for idx, pdf_file in enumerate(pdf_files):
        if pdf_file:
            pdf_content = pdf_file.read()
            pdf_file.seek(0)  # Reset file pointer to the beginning
            pdf_path = f"uploaded_file_{idx + 1}.pdf"
            with open(pdf_path, 'wb') as f:
                f.write(pdf_content)
            
            # Check if the file content is similar to fileBac
            if filebac_content and pdf_content == filebac_content:
                similar_count += 1
            
            # Extract text from the PDF using pdfplumber
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                text_results = ""  
                for page in pdf.pages:
                    text_results += page.extract_text() + "\n"
                    redoublant_count += text_results.count('Redoublant')
                
                # Print if 'Redoublant' occurs more than 2 times
                if redoublant_count > 2:
                    print('redoublant over 2')

                # Find the index of "Situation :" and "Moyenne annuelle" in the text
                situation_index = text_results.find("Situation :")
                moyenne_index = text_results.find("Moyenne annuelle")
                extracted_text_situation = ""
                extracted_text_moyenne = ""
                if situation_index != -1:
                    extracted_text_situation = text_results[situation_index:situation_index + len("Situation :") + 10].strip()
                if moyenne_index != -1:
                    extracted_text_moyenne = text_results[moyenne_index:moyenne_index + len("Moyenne annuelle") + 28].strip()
                results.append({'situation': extracted_text_situation, 'moyenne_annuelle': extracted_text_moyenne})

                # Adjust score if "Redoublant" or "Controle" is found in the text
                if "Redoublant" in text_results:
                    score_accumulator -= 2
                if "Controle" in text_results:
                    score_accumulator -= 1
            
            # Extract tables from the PDF using camelot
            pdf_tables = cam.read_pdf(pdf_path, pages='1', flavor="stream")
            table_results = []
            for i, table in enumerate(pdf_tables):
                df = table.df

                result = ""
                if len(df) > 1:
                    column2 = pd.to_numeric(df.iloc[1:, 2], errors='coerce')
                    column6 = pd.to_numeric(df.iloc[1:, 6], errors='coerce')
                    multiplied_values = column2 * column6
                    total_sum = multiplied_values.sum()
                    column2_sum = column2.sum()
                    if column2_sum != 0:
                        result += f", Moyenne Annuelle: {total_sum / column2_sum:.2f}"
                        total_sum_accumulator += total_sum
                        column2_sum_accumulator += column2_sum
                    else:
                        result += f", Sum of column 2 is zero, cannot divide"

                if len(df) > 1:
                    column3 = pd.to_numeric(df.iloc[1:, 2], errors='coerce')
                    column7 = pd.to_numeric(df.iloc[1:, 6], errors='coerce')

                    # Calculate the score based on conditions
                    score = ((column3 >= 1.5) & (column7 >= 10)).sum()
                    score_accumulator += score

                    column1 = df.iloc[1:, 0]
                    column9 = df.iloc[1:, 6]

                    if len(df) > 1:
                        column1 = df.iloc[3:, 0]
                        column7 = df.iloc[3:, 6]

                        for i in range(len(column1)):
                            if column1.iloc[i] == 'Anglais1' and pd.to_numeric(column7.iloc[i], errors='coerce') > 10:
                                print('Yes, grade in Anglais1 is greater than 10.')
                                scoreanglais += 1
                                score_accumulator += 1

                table_data = df.values.tolist()
                table_results.append({'table': table_data, 'result': result})

                if i == 0:
                    table_results.append({'table': [], 'result': ""})

            results[-1]['tables'] = table_results

            if column2_sum_accumulator != 0:
                moyenne_totale = total_sum_accumulator / column2_sum_accumulator
            else:
                moyenne_totale = 0

            moyenne_totale = moyenne_totale.item() if hasattr(moyenne_totale, 'item') else moyenne_totale
            score_accumulator = score_accumulator.item() if hasattr(score_accumulator, 'item') else score_accumulator

    # Process the fileBac PDF
    if filebac:
        filebac.seek(0)  # Reset file pointer to the beginning
        filebac_path = "uploaded_file_bac.pdf"
        with open(filebac_path, 'wb') as f:
            f.write(filebac_content)

        # Extract tables from the fileBac PDF using camelot
        pdf_tables = cam.read_pdf(filebac_path, pages='1', flavor="stream")
        for table in pdf_tables:
            df = table.df
            print(df)
            if len(df) > 1:
                for index, row in df.iterrows():
                    if 'ةيزيلقنا' in row[2] and pd.to_numeric(row[1], errors='coerce') >= 14:
                        score_bac += 1
                        score_accumulator += 1
                    if 'يئاهنلا\n \nلدعملا' in row[2] and pd.to_numeric(row[1], errors='coerce') >= 14:
                        score_bac += 1
                        score_accumulator += 1

    return jsonify({
        "message": "Files processed successfully",
        "moyenne_totale": moyenne_totale,
        "score_accumulator": score_accumulator,
        "score_bac": score_bac,
        "scoreanglais": scoreanglais,
        "redoublant_count": redoublant_count,
        "similar_count": similar_count
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
