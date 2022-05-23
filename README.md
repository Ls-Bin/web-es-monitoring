# web-es-monitoring
use Elasticsearch + kibana
# Feature 
 * web 
    * js error
    * api request
    * document performance
    * resource load
    * pv/uv
    * web white screen


# elasticsearch install
1. `$ sudo docker pull elasticsearch:7.17.1`
1. `$ sudo docker images`
   ```
 
   test@u20:~$ sudo docker images
   REPOSITORY           TAG       IMAGE ID       CREATED        SIZE
   elasticsearch        7.17.1    515ab4fba870   2 months ago   618MB

   ```
1. `$ sudo docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "ES_JAVA_OPTS=-Xms64m -Xmx128m" elasticsearch:7.17.1 `
1. `$ sudo docker ps`
1. open url  `http://localhost:9200/`

## es config
1. enter docker `docker exec -it elasticsearch /bin/bash`
1. open xpack.security  
   ```

   vi config/elasticsearch.yml

   #input
   xpack.security.enabled: true
   xpack.security.authc.api_key.enabled: true 

   #set password  option: interactive | auto
   $ /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
   ```


# kibana install
1. `$ sudo docker pull kibana:7.17.1`
   ```
   # -e : 指定环境变量配置, 提供汉化
   # --like : 建立两个容器之间的关联, kibana 关联到 es
   $ sudo docker run -d --name kibana --link elasticsearch:elasticsearch -e "I18N_LOCALE=zh-CN" -e NODE_OPTIONS:"--max-old-space-size=512" -p 5601:5601 kibana:7.17.1
   ```
1.  open url  `http://localhost:5601/`


## kibana config
1. copy file to win10 `docker cp kibana:/usr/share/kibana/config/kibana.yml e:\`
1. add es info
   ```
   elasticsearch.username: "kibana"
   elasticsearch.password: "123456"
   xpack.reporting.encryptionKey: "a_random_string"
   xpack.security.encryptionKey: "something_at_least_32_characters"
   ```

1. copy file to docker 
   `docker cp e:\kibana.yml kibana:/usr/share/kibana/config/`