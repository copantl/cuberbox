package main

import (
	"fmt"
	"log"
	"net"
	"time"
)

func main() {
	fmt.Println("CUBERBOX FREESWITCH CONNECTOR - BOOTING...")
	fmt.Println("Version: 4.7.9 (LEGACY CORE)")
	fmt.Println("Status: Listening for ESL Events on 8021...")

	// Puerto original de FreeSwitch ESL
	addr := "127.0.0.1:8021"

	for {
		conn, err := net.Dial("tcp", addr)
		if err != nil {
			log.Printf("ERROR: No se puede conectar a ESL en %s. Reintentando...", addr)
			time.Sleep(5 * time.Second)
			continue
		}

		// Autenticación ESL (Default ClueCon)
		fmt.Fprintf(conn, "auth ClueCon\n\n")

		log.Printf("CONNECTED: Puente de eventos establecido con FreeSwitch 1.10.")

		// Suscribirse a eventos de canal
		fmt.Fprintf(conn, "event plain ALL\n\n")

		buffer := make([]byte, 4096)
		for {
			n, err := conn.Read(buffer)
			if err != nil {
				log.Printf("DISCONNECTED: Enlace ESL perdido.")
				conn.Close()
				break
			}
			
			response := string(buffer[:n])
			// Telemetría de latido
			if len(response) > 0 {
				fmt.Print(".") 
			}
		}
		time.Sleep(2 * time.Second)
	}
}
