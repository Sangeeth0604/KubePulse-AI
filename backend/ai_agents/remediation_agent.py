from ai_agents.cpu_agent import analyze_cpu
from ai_agents.memory_agent import analyze_memory


def generate_remediation_plan():
    cpu_alerts = analyze_cpu()
    memory_alerts = analyze_memory()

    actions = []

    if cpu_alerts:
        actions.append({
            "title": "Scale result-service",
            "severity": "HIGH",
            "reason": "CPU usage is above safe threshold.",
            "command": "kubectl scale deployment result-service --replicas=2"
        })

        actions.append({
            "title": "Enable CPU autoscaling",
            "severity": "MEDIUM",
            "reason": "Autoscaling helps handle future traffic spikes.",
            "command": "kubectl autoscale deployment result-service --cpu-percent=70 --min=1 --max=3"
        })

    if memory_alerts:
        actions.append({
            "title": "Inspect grading database pod",
            "severity": "HIGH",
            "reason": "Memory usage is above safe threshold.",
            "command": "kubectl describe pod grading-db-pod"
        })

        actions.append({
            "title": "Check database logs",
            "severity": "MEDIUM",
            "reason": "Logs may reveal heavy queries or memory pressure.",
            "command": "kubectl logs deployment/grading-db-pod"
        })

    if not actions:
        actions.append({
            "title": "No remediation required",
            "severity": "LOW",
            "reason": "Cluster is healthy.",
            "command": "No action needed"
        })

    return actions