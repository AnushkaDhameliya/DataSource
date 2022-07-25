from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

import pandas as pd
import json
from sklearn.preprocessing import LabelEncoder
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb
from matplotlib import pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Create your views here.

@csrf_exempt
def actionApi(request):

    if request.method == 'POST':
        
        message = ""

        data = JSONParser().parse(request)

        actionName = data["ActionName"]
        
        
        
        #outputFileName = data["outputFileName"]

        jsonData = data["jsonData"]
        
        #outputFilePath = 'C:/Users/anush/Desktop/Virtual Desktop/Data Analytics Files/'+outputFileName+'.xlsx'

        #merge action
        if actionName == "Merge":
            fileList = data["fileList"]
            mergeColumn = data["mergeColumn"]
            dataframes = []
            for fileName in fileList:
                dataFile = pd.read_csv(fileName)
                dataframes.append(dataFile)
            
            mergeData = dataframes[0]

            for i in range(1,len(fileList)):
                mergeData = mergeData.merge(dataframes[i],on=mergeColumn,how='outer')
            
            data = []
            for rows in mergeData:
                data.append(rows)
            
            result = mergeData.to_json(orient="records")
            message = json.loads(result)
        
        #sort action
        if actionName == "Sort":
            json_object = json.loads(jsonData)
            dataFile = pd.json_normalize(json_object)
            sortColumnNames = data["sortColumnNames"]
            sortedData = dataFile.sort_values(by=sortColumnNames,kind='mergesort')
            
            result = sortedData.to_json(orient="records")
            message = json.loads(result)

        #projection action
        if actionName == "Projection":
            projectColumns = data["projectColumns"]
            json_object = json.loads(jsonData)
            dataFile = pd.json_normalize(json_object)
            selectedData = pd.DataFrame(dataFile,columns=projectColumns)
            
            result = selectedData.to_json(orient="records")
            message = json.loads(result) 

        #encode action
        if actionName == "Encode":
            json_object = json.loads(jsonData)
            dataFile = pd.json_normalize(json_object)
            encodingColumns = data["encodingColumns"]
            labelencoder = LabelEncoder()

            for i in encodingColumns: 
                dataFile[i] =  labelencoder.fit_transform(dataFile[i])
            
            result = dataFile.to_json(orient="records")
            message = json.loads(result)
        
        #coorelation action
        if actionName == "Correlation":
            json_object = json.loads(jsonData)
            dataFile = pd.json_normalize(json_object)
            
            pearsoncorr = dataFile.corr(method='pearson')
            
            plt.figure()

            f, ax = plt.subplots(figsize =(15, 15))
            sb.heatmap(pearsoncorr, ax = ax, cmap ="YlGnBu", linewidths = 0.1)

            plt.savefig('C:/Users/anush/Desktop/Virtual Desktop/Data Analytics Files/output.png')

            message = "Graph plotted"

        #analysis
        if actionName == "Decision Tree":
            json_object = json.loads(jsonData)
            dataFile = pd.json_normalize(json_object)
            x_columns = data["x_columns"]
            y_columns = data["y_columns"]
            x_data =  pd.DataFrame(dataFile,columns=x_columns)

            y_data =  pd.DataFrame(dataFile,columns=y_columns)

            x_training_data, x_test_data, y_training_data, y_test_data = train_test_split(x_data, y_data, test_size = 0.3)
            
            sc = StandardScaler()

            X_train = sc.fit_transform(x_training_data)
            X_test = sc.transform(x_test_data)

            classifer = DecisionTreeClassifier(criterion='entropy', random_state=0)
            classifer.fit(X_train,y_training_data)
            y_pred = classifer.predict(X_test)

            accuracy=accuracy_score(y_test_data,y_pred)
            f1_score=f1_score(y_test_data,y_pred,average=None)
            message = "Accuracy:" + str(format((accuracy*100),".4f"),"%")

    return JsonResponse(message,safe=False)


