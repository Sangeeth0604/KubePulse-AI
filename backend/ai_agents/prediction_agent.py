from database import get_recent_metrics


APP_PODS = (
    "student-login-service",
    "result-service",
    "fee-payment-service",
    "grading-db-pod",
)


def cpu_to_millicores(cpu):
    if not cpu:
        return 0

    if cpu.endswith("n"):
        return int(int(cpu.replace("n", "")) / 1000000)

    if cpu.endswith("m"):
        return int(cpu.replace("m", ""))

    return int(cpu) if str(cpu).isdigit() else 0


def memory_to_mi(memory):
    if not memory:
        return 0

    if memory.endswith("Ki"):
        return int(int(memory.replace("Ki", "")) / 1024)

    if memory.endswith("Mi"):
        return int(memory.replace("Mi", ""))

    return int(memory) if str(memory).isdigit() else 0


def predict_risk():
    history = get_recent_metrics()

    predictions = []

    for pod_prefix in APP_PODS:
        pod_records = [
            item for item in history
            if item["pod"].startswith(pod_prefix)
        ]

        if len(pod_records) < 1:
            continue

        latest = pod_records[0]

        latest_cpu = cpu_to_millicores(latest["cpu"])
        latest_memory = memory_to_mi(latest["memory"])

        # Critical current CPU load
        if latest_cpu >= 1000:
            predictions.append({
                "pod": latest["pod"],
                "risk": "Critical CPU Load",
                "prediction": "Pod is currently under heavy CPU stress and may become unstable"
            })

        # Increasing CPU trend
        if len(pod_records) >= 2:
            previous = pod_records[1]
            previous_cpu = cpu_to_millicores(previous["cpu"])

            if latest_cpu > previous_cpu and latest_cpu > 100:
                predictions.append({
                    "pod": latest["pod"],
                    "risk": "CPU usage is increasing",
                    "prediction": "This pod may become overloaded soon"
                })

        # High current memory usage
        if latest_memory >= 500:
            predictions.append({
                "pod": latest["pod"],
                "risk": "High Memory Consumption",
                "prediction": "Pod may face memory pressure soon"
            })

        # Increasing memory trend
        if len(pod_records) >= 2:
            previous = pod_records[1]
            previous_memory = memory_to_mi(previous["memory"])

            if latest_memory > previous_memory and latest_memory > 100:
                predictions.append({
                    "pod": latest["pod"],
                    "risk": "Memory usage is increasing",
                    "prediction": "Possible memory pressure or leak developing"
                })

    if not predictions:
        predictions.append({
            "pod": "cluster",
            "risk": "Stable",
            "prediction": "No immediate overload risk detected"
        })

    return predictions