import threading
import time

from metrics.k8s_metrics import get_pod_metrics
from database import insert_metric


def collect_metrics_forever():
    while True:
        try:
            metrics = get_pod_metrics()

            if isinstance(metrics, list):
                for item in metrics:
                    insert_metric(
                        item["pod"],
                        item["cpu"],
                        item["memory"]
                    )

            print("Metrics collected")

        except Exception as e:
            print("Collector error:", e)

        time.sleep(10)


def start_collector():
    thread = threading.Thread(
        target=collect_metrics_forever,
        daemon=True
    )

    thread.start()