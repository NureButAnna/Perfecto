from locust import HttpUser, task, between

class ServicesLoadTest(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_all_services(self):
        self.client.get("/services/")

    @task
    def get_service_by_id(self):
        self.client.get("/services/1")


class AuthLoadTest(HttpUser):
    wait_time = between(1, 3)

    @task
    def login_valid(self):
        self.client.post("/auth/login", data={
            "username": "delivery@gmail.com",
            "password": "111111"
        })

    @task
    def login_invalid(self):
        self.client.post("/auth/login", data={
            "username": "wrong@gmail.com",
            "password": "wrongpassword"
        })