from ai_agents.cpu_agent import analyze_cpu
from ai_agents.memory_agent import analyze_memory
from ai_agents.prediction_agent import predict_risk


def calculate_risk_score():
    cpu_alerts = analyze_cpu()
    memory_alerts = analyze_memory()
    predictions = predict_risk()

    cpu_risk = 20
    memory_risk = 20
    prediction_risk = 10
    confidence = 70

    if cpu_alerts:
        cpu_risk = 90
        confidence += 8

    if memory_alerts:
        memory_risk = 75
        confidence += 7

    if predictions and predictions[0].get("risk") != "Stable":
        prediction_risk = 80
        confidence += 7

    overall_risk = int((cpu_risk + memory_risk + prediction_risk) / 3)
    confidence = min(confidence, 92)

    if overall_risk >= 75:
        stability = "High Risk"
        status = "Potential resource exhaustion predicted within 15 minutes."
    elif overall_risk >= 50:
        stability = "Medium"
        status = "Cluster shows moderate instability risk."
    else:
        stability = "Stable"
        status = "Cluster is operating within safe resource limits."

    return {
        "overall_risk": overall_risk,
        "cpu_risk": cpu_risk,
        "memory_risk": memory_risk,
        "stability": stability,
        "confidence": confidence,
        "status": status
    }