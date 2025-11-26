# Steps

## Install XAMPP and Git

- [XAMPP download](https://www.apachefriends.org/download.html)

- Before downloading the **Git**, check if it is already install. Go to the **command prompt**, type git. If there is an error, follow this:
  - [Git download](https://git-scm.com/install/windows)
  - Watch this: [Git setup tutorial](https://youtu.be/s_ll71Q9CaI)

## Configure credentials

- Go to the **command prompt**, type: 

```bash
git config --global user.name "Your Name"
git config --global user.email "Your Email"
```

REPLACE THE "Your Name" AND "Your Email" with your credentials

## Go to the folder of htdocs (inside the XAMPP folder)

- Go to the **command prompt**, type: 

```bash
cd C:\xampp\htdocs\
git clone https://github.com/Adamskiee/WST-Project.git
```

- Go to the **VS Code** and navigate the `C:\xampp\htdocs\WST-Project`

## Configure the database

- Run the **XAMPP**. Then run **MYSQL** an **Apache**
- Go to the [PHPMyAdmin](http://localhost/phpmyadmin/), and go the import tab. Choose file and navigate to the `C:\xampp\htdocs\WST-Project\database\narrowway_traffic_db.sql`
