MISSION_PAYLOAD = {
    "title": "Test Mission",
    "client": "Client Test",
    "consultant": "Anas Mehri",
    "status": "in_progress",
    "start_date": "2026-01-01",
    "deadline": "2026-12-31",
    "description": "Mission de test",
}


def test_create_mission(client):
    res = client.post("/api/missions/", json=MISSION_PAYLOAD)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == MISSION_PAYLOAD["title"]
    assert data["client"] == MISSION_PAYLOAD["client"]
    assert "id" in data


def test_list_missions(client):
    res = client.get("/api/missions/")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_get_mission(client):
    # Create then fetch
    created = client.post("/api/missions/", json=MISSION_PAYLOAD).json()
    res = client.get(f"/api/missions/{created['id']}")
    assert res.status_code == 200
    assert res.json()["id"] == created["id"]


def test_update_mission(client):
    created = client.post("/api/missions/", json=MISSION_PAYLOAD).json()
    res = client.patch(f"/api/missions/{created['id']}", json={"status": "completed"})
    assert res.status_code == 200
    assert res.json()["status"] == "completed"


def test_delete_mission(client):
    created = client.post("/api/missions/", json=MISSION_PAYLOAD).json()
    res = client.delete(f"/api/missions/{created['id']}")
    assert res.status_code == 204
    # Confirm 404 after deletion
    res2 = client.get(f"/api/missions/{created['id']}")
    assert res2.status_code == 404


def test_get_mission_not_found(client):
    res = client.get("/api/missions/99999")
    assert res.status_code == 404
