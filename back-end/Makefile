venv:
	python -m venv ./venv
	source venv/bin/activate
	pip install -r requirements.txt


pip.install:
	pip install -r requirements.txt


DB = "geoprob"
USER = "mobapp_user"
PWD = "mobapp"
URL	= http://127.0.0.1:5000
PYTEST	= pytest -x --log-level=debug --capture=tee-sys
PYTHON = ./venv/bin/python
export PGPASSWORD="mobapp"


.PHONY:run
run: 
	adb reverse tcp:5000 tcp:5000
	createdb -U $(USER) -h localhost  $(DB)
	type flask || exit 1  # check for flask
	python app2.py

.PHONY:reload
reload: 
	adb reverse tcp:5000 tcp:5000
	make stop2
	make clean
	createdb -U $(USER) -h localhost  $(DB)
	type flask || exit 1  # check for flask
	python app2.py



clean: 
	psql -U mobapp_user -d geoprob -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'geoprob';" || true
	dropdb -U $(USER) -h localhost  $(DB)
	rm -rf app.log app.pid myapp.log
	make stop2

.PHONY:stop
stop:
	# soft stop…
	[ -f app.pid ] && kill $$(cat app.pid)
	rm -f app.pid

.PHONE:stop2
stop2:
	#hard stop
	#use double $$ sign to escape $ sign
	lsof -i :5000 | grep 'python' | awk '{print $$2}' | head -1 | xargs -n1 kill
	rm -f app.pid


.PHONE:stop3
stop3:
	#hard stop
	#use double $$ sign to escape $ sign
	ps | grep "backend_mobapp/app" | awk '{print $$1}' | head -1 | xargs -n1 kill
	rm -f app.pid


.PHONY : check
check:
	$(PYTEST) test2.py #there could be an error here
	#we need to catch and then stop
	echo "--- after pytest-- "
	

.PHONY : check.on
check.on : 
	curl $(URL)

.PHONY : print.user2
print.user2:
	psql -U mobapp_user -W  geoprob -c "select * from user2;"