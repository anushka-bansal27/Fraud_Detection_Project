import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import precision_recall_fscore_support, accuracy_score, classification_report

# ---------------------------
# 1. Load Dataset
# ---------------------------
import os

# Get the project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'creditcard.csv')

df = pd.read_csv(DATA_PATH)
df = df.fillna(df.median())

# ---------------------------
# 2. Features & Target
# ---------------------------
X = df.drop("Class", axis=1)
y = df["Class"]

# Save feature names (in model directory)
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
joblib.dump(list(X.columns), os.path.join(MODEL_DIR, "feature_names.pkl"))

# ---------------------------
# 3. Train-Test Split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---------------------------
# 4. Feature Scaling
# ---------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))

# ---------------------------
# 5. PCA (keep everything)
# ---------------------------
pca = PCA(n_components=0.95, random_state=42)
X_train_scaled = pca.fit_transform(X_train_scaled)
X_test_scaled = pca.transform(X_test_scaled)
joblib.dump(pca, os.path.join(MODEL_DIR, "pca.pkl"))

# ---------------------------
# 6. Handle Class Imbalance (undersample)
# ---------------------------
train_df = pd.DataFrame(X_train_scaled)
train_df["Class"] = y_train.values

fraud = train_df[train_df["Class"] == 1]
legit = train_df[train_df["Class"] == 0].sample(len(fraud), random_state=42)

balanced = pd.concat([fraud, legit]).sample(frac=1, random_state=42)

X_bal = balanced.drop("Class", axis=1).values
y_bal = balanced["Class"].values

# ---------------------------
# 7. Train Models Sequentially
# ---------------------------
# Train Logistic Regression first (fast)
print("Training Logistic Regression...")
log_reg = LogisticRegression(class_weight="balanced", max_iter=1000, n_jobs=-1)
log_reg.fit(X_bal, y_bal)

# Train Decision Tree next (fast)
print("Training Decision Tree...")
tree = DecisionTreeClassifier(class_weight="balanced", max_depth=5)
tree.fit(X_bal, y_bal)

# Train SVM last with small subset (prevent freezing)
print("Training SVM (subset for speed)...")
subset_size = 5000  # keep small for SVM
if len(X_bal) > subset_size:
    X_svm, y_svm = X_bal[:subset_size], y_bal[:subset_size]
else:
    X_svm, y_svm = X_bal, y_bal

svm = SVC(class_weight="balanced", probability=True)
svm.fit(X_svm, y_svm)

# ---------------------------
# 8. Evaluate & Select Best
# ---------------------------
def evaluate(model):
    pred = model.predict(X_test_scaled)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, pred, average="binary", pos_label=1
    )
    return f1

models = {"logreg": log_reg, "tree": tree, "svm": svm}
scores = {name: evaluate(model) for name, model in models.items()}
best_model_name = max(scores, key=scores.get)
best_model = models[best_model_name]

# Save best model
joblib.dump(best_model, os.path.join(MODEL_DIR, "fraud_model.pkl"))

# ---------------------------
# 9. Final Report
# ---------------------------
y_pred = best_model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print("\nTraining complete!")
print("Best model:", best_model_name)
print("\nAccuracy:", accuracy)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nFiles saved:")
print(" - fraud_model.pkl")
print(" - scaler.pkl")
print(" - feature_names.pkl")
print(" - pca.pkl")
