import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# for splitting data to train and test partition
from sklearn.model_selection import cross_validate
from sklearn.model_selection import train_test_split

# Classifier for modelling
from sklearn.naive_bayes import GaussianNB, BernoulliNB, MultinomialNB
from sklearn import tree
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier

# Evaluates model
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score

# Sample data provided by sklearn
from sklearn.datasets import load_iris

# Load the iris dataset
iris = load_iris()
X = iris.data
y = iris.target

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize our classifiers
models = {
    'Gaussian Naive Bayes': GaussianNB(),
    'Decision Tree': tree.DecisionTreeClassifier(),
    'K-Nearest Neighbors': KNeighborsClassifier(),
    'Neural Network': MLPClassifier(max_iter=1000)
}

# Dictionary to store our results
results = {}

# Evaluate each model using cross-validation
for name, model in models.items():
    # Perform 5-fold cross validation
    cv_results = cross_validate(
        model, 
        X, 
        y,
        cv=5,
        scoring={
            'accuracy': 'accuracy',
            'precision_weighted': 'precision_weighted',
            'recall_weighted': 'recall_weighted',
            'f1_weighted': 'f1_weighted'
        }
    )
    
    # Store mean evaluation metrics
    results[name] = {
        'accuracy': cv_results['test_accuracy'].mean(),
        'precision': cv_results['test_precision_weighted'].mean(),
        'recall': cv_results['test_recall_weighted'].mean(),
        'f1': cv_results['test_f1_weighted'].mean()
    }

# Print results
print("\nModel Evaluation Results:")
print("-" * 50)
for model_name, metrics in results.items():
    print(f"\n{model_name}:")
    for metric_name, value in metrics.items():
        print(f"{metric_name}: {value:.4f}")

# Create visualization of results
plt.figure(figsize=(12, 6))
metrics = ['accuracy', 'precision', 'recall', 'f1']
x = np.arange(len(models))
width = 0.2
multiplier = 0

for metric in metrics:
    metric_values = [results[model][metric] for model in models]
    offset = width * multiplier
    plt.bar(x + offset, metric_values, width, label=metric)
    multiplier += 1

plt.xlabel('Models')
plt.ylabel('Scores')
plt.title('Model Performance Comparison')
plt.xticks(x + width * 1.5, models.keys(), rotation=45)
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig('model_comparison.png')