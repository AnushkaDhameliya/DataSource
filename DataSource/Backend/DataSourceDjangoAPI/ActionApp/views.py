from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

import pandas as pd
import json

# Create your views here.

@csrf_exempt
def actionApi(request):

    if request.method == 'POST':
        
        message = ""

        data = JSONParser().parse(request)

        actionName = data["ActionName"]
        fileList = data["fileList"]
        mergeColumnName = data["mergeCoulmnName"]
        sortColumnNames = data["sortColumnNames"]
        projectColumns = data["projectColumns"]
        outputFileName = data["outputFileName"]

        dataframes = []
        
        outputFilePath = 'C:/Users/anush/Desktop/Virtual Desktop/Data Analytics Files/'+outputFileName+'.xlsx'

        #merge action
        if actionName == "Merge":
            for fileName in fileList:
                dataFile = pd.read_excel(fileName)
                dataframes.append(dataFile)
            
            mergeData = dataframes[0]

            for i in range(1,len(fileList)):
                mergeData = mergeData.merge(dataframes[i],on=mergeColumnName,how='outer')
            
            message = "Merged Successfully"
            mergeData.to_excel(outputFilePath, index = False)

        
        #sort action
        if actionName == "Sort":
            fileName = fileList[0]
            dataFile = pd.read_excel(fileName)

            sortedData = dataFile.sort_values(by=sortColumnNames,kind='mergesort')
            
            message = "Sorted Successfully"
            sortedData.to_excel(outputFilePath, index = False)    

        #projection action
        if actionName == "Projection":
            fileName = fileList[0]
            dataFile = pd.read_excel(fileName)

            selectedData = pd.DataFrame(dataFile,columns=projectColumns)
            
            message = "Projected Successfully"
            selectedData.to_excel(outputFilePath, index = False)    

    return JsonResponse(message,safe=False)
            


