Part of the code in this project has been automatically generated from the suggestions of Github Copilot.

I intentionally excluded `.env` files in the `.gitignore` to ease the process to set up the project.

PostgreSQL Database Server will be run in a Docker container, but I have removed `-d` flag from `docker compose up` command in order to be able to run the project as a foreground process with no hidden daemonization even after closing the terminal.