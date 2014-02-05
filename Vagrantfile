Vagrant.configure("2") do |config|
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  config.vm.network "private_network", ip: "192.168.50.4"
  config.vm.provision "shell", path: "vagrant/provision.sh"
end
