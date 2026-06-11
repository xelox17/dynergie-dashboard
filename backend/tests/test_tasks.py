TASK_PAYLOAD = {
    "mission_id": 1,
    "title": "Tâche de test",
    "status": "todo",
    "priority": 2,
    "assignee": "Anas Mehri",
}

MISSION_PAYLOAD = {
    "title": "Mission pour tâches",
    "client": "Client X",
    "consultant": "Anas Mehri",
    "status": "in_progress",
    "start_date": "2026-01-01",
    "deadline": "2026-12-31",
}


def test_create_and_list_tasks(client):
    # Create mission first
    mission = client.post("/api/missions/", json=MISSION_PAYLOAD).json()
    payload = {**TASK_PAYLOAD, "mission_id": mission["id"]}

    res = client.post("/api/tasks/", json=payload)
    assert res.status_code == 201
    assert res.json()["title"] == payload["title"]

    tasks = client.get(f"/api/tasks/?mission_id={mission['id']}").json()
    assert any(t["title"] == payload["title"] for t in tasks)


def test_update_task_status(client):
    mission = client.post("/api/missions/", json=MISSION_PAYLOAD).json()
    payload = {**TASK_PAYLOAD, "mission_id": mission["id"]}
    task = client.post("/api/tasks/", json=payload).json()

    res = client.patch(f"/api/tasks/{task['id']}", json={"status": "done"})
    assert res.status_code == 200
    assert res.json()["status"] == "done"
